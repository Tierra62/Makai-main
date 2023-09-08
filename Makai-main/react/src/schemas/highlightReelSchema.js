import * as Yup from "yup";

const HighlightReelSchema = Yup.object().shape({
  productId: Yup.number().required("A product is required"),
  imageUrl: Yup.string().max(255).required("Image Url is required"),
  isApproved: Yup.bool().required("Approval is required"),
});

export { HighlightReelSchema };
