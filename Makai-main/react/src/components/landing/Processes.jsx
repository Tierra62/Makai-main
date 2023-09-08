import React from "react";
import processList from "data/feature/processList";
import Section from "components/common/Section";
import Process from "./Process";
import SectionHeader from "./SectionHeader";
import { isIterableArray } from "helpers/utils";

const Processes = () => (
  <Section className="landing-bg-ocean-dark">
    <SectionHeader title="Renting is easy with Makai!" />
    {isIterableArray(processList) &&
      processList.map((process, index) => (
        <Process key={process.color} isFirst={index === 0} {...process} />
      ))}
  </Section>
);

export default Processes;
