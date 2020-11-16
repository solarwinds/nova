import { DashwizStepComponent } from "./dashwiz-step.component";

describe("components >", () => {
    describe("wizard-step >", () => {
        let subject: DashwizStepComponent;

        beforeEach(() => {
            subject = new DashwizStepComponent();
        });

        it("should run enterStep and change active, visited and icon params", () => {
            expect(subject.active).toBeFalsy();
            expect(subject.visited).toBeFalsy();
            expect(subject.icon).toBe("step");
            subject.enterStep();
            expect(subject.active).toBeFalsy();
            expect(subject.visited).toBeFalsy();
            expect(subject.icon).toBe("step");
            subject.applyEnteringStep();
            expect(subject.active).toBeTruthy();
            expect(subject.visited).toBeFalsy();
            expect(subject.icon).toBe("step-active");
        });

        it("should run exitStep and change active and icon params", () => {
            subject.applyEnteringStep();
            expect(subject.active).toBeTruthy();
            expect(subject.icon).toBe("step-active");
            subject.exitStep();
            expect(subject.active).toBeTruthy();
            expect(subject.icon).toBe("step-active");
            subject.applyExitingStep();
            expect(subject.active).toBeFalsy();
            expect(subject.icon).toBe("step-complete");
        });
    });
});
