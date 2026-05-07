import { checkmarkCircle, closeCircle } from "ionicons/icons";
import type React from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import type { RootState } from "@/state";
import { testsPassedSelector } from "@/state/arena/log";
import { dojoLevelSelector } from "@/state/dojo/log";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { seenTotalsSelector } from "@/state/study/log";
import { GroupCard, Row, Section, SectionTitle } from "./";

type Props = PropsFromState;

const ChecklistComponent: React.FC<Props> = (props) => {
  const total = props.seenTotals[ROOT_NAVIGATION_KEY] || { seen: 0, total: 0 };
  const seenProgress = total.total ? Math.floor((total.seen / total.total) * 100) : 0;
  const studyComplete = seenProgress === 100;
  const levelComplete = props.dojoLevel >= 5;
  const arenaComplete = props.areaTestsPassed >= 3;

  return (
    <Section>
      <SectionTitle>
        <Translate text="checklist" />
      </SectionTitle>
      <Translator>
        {({ translate }) => (
          <GroupCard>
            <Row
              name={translate({ text: "checklistReadAll" })}
              value={`${seenProgress}%`}
              icon={studyComplete ? checkmarkCircle : closeCircle}
              status={studyComplete ? "complete" : "incomplete"}
            />
            <Row
              name={translate({ text: "checklistReachLevel" })}
              value={translate({
                text: "levelNumber",
                data: { number: props.dojoLevel },
              })}
              icon={levelComplete ? checkmarkCircle : closeCircle}
              status={levelComplete ? "complete" : "incomplete"}
            />
            <Row
              name={translate({ text: "checklistCompleteArena" })}
              value={`${props.areaTestsPassed} / 3`}
              icon={arenaComplete ? checkmarkCircle : closeCircle}
              status={arenaComplete ? "complete" : "incomplete"}
            />
          </GroupCard>
        )}
      </Translator>
    </Section>
  );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    seenTotals: seenTotalsSelector(state),
    areaTestsPassed: testsPassedSelector(state),
    dojoLevel: dojoLevelSelector(state),
  };
};

const Checklist = connect(mapStateToProps)(ChecklistComponent);

export { Checklist };
