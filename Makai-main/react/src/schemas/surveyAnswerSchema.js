import * as Yup from "yup";

export const SurveyAnswerSchema = Yup.object().shape({
  answers: Yup.array()
    .of(
      Yup.object().shape({
        instanceId: Yup.number().integer().positive(),
        questionId: Yup.number().integer().positive().required(),
        answerOptionId: Yup.number().integer().positive().required(),
        answer: Yup.string().required("Please select an answer."),
        answerNumber: Yup.number().integer().positive().required(),
      })
    )
    .required("Required to submit survey."),
});

export default { SurveyAnswerSchema };
