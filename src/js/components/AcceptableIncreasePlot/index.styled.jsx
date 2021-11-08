import styled from 'styled-components';

const PlotHeader = styled.h2`
  text-align: center;
`


const PlotContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const SvgContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;
`;

const SvgContent = styled.svg`
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

export { PlotHeader, PlotContainer, SvgContainer, SvgContent };
