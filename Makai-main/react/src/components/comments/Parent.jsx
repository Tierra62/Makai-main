import React, { useState } from "react";
import CommentForm from "./CommentForm";

//function Parent(props) {
function Parent() {
  const [entityId] = useState(1);
  const [entityTypeId] = useState(1);

  return <CommentForm entityId={entityId} entityTypeId={entityTypeId} />;
}

export default Parent;
