import React from 'react';
import styled from 'styled-components';
import TravelMap from './components/TravelMap';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
  padding: 20px;
`;

const Title = styled.h1`
  color: #ff6b6b;
  margin: 20px 0;
  font-family: 'Arial', sans-serif;
  text-align: center;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(255, 107, 107, 0.2);
`;

const Subtitle = styled.p`
  color: #ff9999;
  margin-bottom: 30px;
  font-size: 1.2rem;
  text-align: center;
  line-height: 1.6;
`;

function App() {
  return (
    <AppContainer>
      <Title>고은💕태훈</Title>
      <Subtitle>
        함께한 모든 순간이 특별했고,<br />
        앞으로도 더 많은 추억을 만들어가고 싶어요
      </Subtitle>
      <TravelMap />
    </AppContainer>
  );
}

export default App; 