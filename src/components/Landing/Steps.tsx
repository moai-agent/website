import LoopVideo from "./LoopVideo";
import StepTerminal from "./StepTerminal";
import { STEPS } from "./transcript";

/**
 * Each step is its own linkable section with at most one artwork behind it
 * and its own replayable terminal.
 */
export default function Steps() {
  return (
    <>
      {STEPS.map((step) => (
        <section key={step.id} id={step.id} className="step" aria-labelledby={`${step.id}-heading`}>
          {step.backdrop && (
            <div className={`step-media step-media--${step.backdrop.kind}`} aria-hidden="true">
              {step.backdrop.kind === "video" ? (
                <LoopVideo name={step.backdrop.name} className="step-video" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={step.backdrop.src}
                  alt=""
                  className={step.backdrop.kind === "photo" ? "step-photo" : "step-image"}
                  loading="lazy"
                />
              )}
            </div>
          )}
          <div className="step-copy">
            <h2 id={`${step.id}-heading`}>
              {step.heading}
              <a href={`#${step.id}`} className="anchor" aria-label={`Link to ${step.label}`}>
                #
              </a>
            </h2>
            <p>{step.note}</p>
          </div>
          <StepTerminal step={step} />
        </section>
      ))}
    </>
  );
}
