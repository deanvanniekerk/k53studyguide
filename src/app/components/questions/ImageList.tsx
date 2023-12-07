import { QuestionItem } from '@/data';
import React from 'react';
import styled from 'styled-components';

type Props = {
  question: QuestionItem;
};

const ImageList: React.FC<Props> = ({ question }) => {
  return (
    <>
      {question.image && (
        <ImageWrapper>
          <img alt="" src={`assets/images/${question.image}`} style={{ maxWidth: '100%' }} />
        </ImageWrapper>
      )}
      {question.image2 && (
        <ImageWrapper>
          <img alt="" src={`assets/images/${question.image2}`} style={{ maxWidth: '100%' }} />
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
