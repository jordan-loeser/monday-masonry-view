import React from "react";
import styled from "styled-components";

const InstructionScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const InstructionsScreen = () => (
  <InstructionScreenContainer data-testid="instructions">
    <h2>There are no items to show! </h2>
    <p>
      Either select an "Image Column" or check "Show Items Without Images" to
      use this view.
    </p>
  </InstructionScreenContainer>
);

export default InstructionsScreen;
