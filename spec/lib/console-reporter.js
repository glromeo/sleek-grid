export default {

    jasmineStarted(suiteInfo) {
        console.group("jasmine: started", suiteInfo);
    },

    suiteStarted(result) {
        console.group(`jasmine suite: ${result.fullName} %c...`, "color: gray");
    },

    specStarted(result) {
        console.log(`jasmine spec: ${result.description} %c...`, "color: gray");
    },

    specDone({failedExpectations, description, passedExpectations, pendingReason, status}) {
        if (status === "pending") {
            console.log(
                `jasmine spec: ${description}%c - %cPENDING%c because ${pendingReason}`,
                "color: gray",
                "color: orange",
                "color: auto"
            );
        } else {
            console.log(
                `jasmine spec: ${
                    description
                }%c - %c${passedExpectations.length} PASSED%c, %c${failedExpectations.length} FAILED`,
                "color: gray",
                "color: green",
                "color: gray",
                "color: red"
            );
        }

        for (let i = 0; i < failedExpectations.length; i++) {
            const failure = failedExpectations[i];
            console.log(`jasmine spec failure: ${(failure.message)}\n%c${failure.stack.trim()}`,
                "color: orange;"
            );
        }
    },

    suiteDone({failedExpectations, fullName, status}) {
        console.groupEnd();
        console.log(
            `jasmine suite: ${fullName} %c- %c${status.toUpperCase()}`,
            "color: gray",
            status === "passed" ? "color:green" : status === "pending" ? "color:orange" : "color:red"
        );
        for (let i = 0; i < failedExpectations.length; i++) {
            console.log("jasmine: suite failure: " + failedExpectations[i].message);
            console.log(failedExpectations[i].stack);
        }
    },

    jasmineDone({overallStatus, totalTime, failedExpectations}) {
        console.groupEnd();
        console.log(
            `jasmine: done: status %c${overallStatus}%c, total-time: %c${totalTime}ms`,
            overallStatus === "passed" ? "color:green" : overallStatus === "pending" ? "color:orange" : "color:red",
            "color: auto",
            "color: cornflowerblue"
        );
        for (let i = 0; i < failedExpectations.length; i++) {
            console.log("jasmine: global failure: " + failedExpectations[i].message, failedExpectations[i].stack);
        }
    }

}