import AcceptableIncreasePlot from "js/components/AcceptableIncreasePlot";
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const Main = () => {
  return (
    <MainContainer>
      <AcceptableIncreasePlot />
    </MainContainer>
  );
};

export default Main;
