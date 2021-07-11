import consoleReporter from "./console-reporter.js";

const jasmineRequire = window.jasmineRequire;
const jasmine = jasmineRequire.core(jasmineRequire);

const env = jasmine.getEnv();

const jasmineInterface = jasmineRequire.interface(jasmine, env);

jasmineInterface.before = jasmineInterface.beforeAll;
jasmineInterface.after = jasmineInterface.afterAll;

jasmineInterface.beforeSuite = new Set();
jasmineInterface.afterSuite = new Set();

for (const method of ["describe", "fdescribe", "xdescribe"]) {
    const original = jasmineInterface[method];
    jasmineInterface[method] = function (description, specDefinitions) {
        return original.call(this, description, function () {
            const userContext = this.sharedUserContext();
            try {
                for (const beforeSuite of jasmineInterface.beforeSuite) {
                    beforeSuite.call(this, userContext);
                }
                specDefinitions.apply(this);
            } finally {
                for (const afterSuite of jasmineInterface.afterSuite) {
                    afterSuite.call(this, userContext);
                }
            }
        });
    };
}

jasmineInterface.beforeSuite.add(function (userContext) {
    userContext.suite = Object.create(this.result);
    userContext.suite.fixtures = [];
});

const context = {};

jasmineInterface.beforeEach(function () {
    context.suite = this.suite;
});

Object.assign(window, jasmineInterface);

env.addReporter(consoleReporter);

env.configure({
    // TODO: load configuration here...
});

const query = new URLSearchParams(window.location.search);
if (query.has("spec")) {
    import((`../${query.get("spec")}.spec.mjs`)).then(()=>env.execute());
} else {
    console.warn("no spec specified, please use search param 'spec' to specify a spec to run.");
}