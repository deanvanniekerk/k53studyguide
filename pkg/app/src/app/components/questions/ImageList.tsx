import type React from "react";
import styled from "styled-components";
import { assetUrl } from "@/app/assetUrl";
import { RetryableImage } from "@/app/components/RetryableImage";
import type { QuestionItem } from "@/data";

type Props = {
  question: QuestionItem;
};

const ImageList: React.FC<Props> = ({ question }) => {
  return (
    <>
      {question.image && (
        <ImageWrapper>
          <RetryableImage alt="" src={assetUrl(`images/${question.image}`)} style={{ maxWidth: "100%" }} />
        </ImageWrapper>
      )}
      {question.image2 && (
        <ImageWrapper>
          <RetryableImage alt="" src={assetUrl(`images/${question.image2}`)} style={{ maxWidth: "100%" }} />
        </ImageWrapper>
      )}
    </>
  );
};

const ImageWrapper = styled.div`
  text-align: center;
  padding-top: 20px;
  width: 100%;
`;

export { ImageList };
