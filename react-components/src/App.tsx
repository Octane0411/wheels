import { useState } from 'react'
import StarRating from "./components/wheels/StarRating";
import Container from "./components/common/Container";
import styled from "styled-components";
import Bin2Dec from "./components/wheels/Bin2Dec";

const AppContainer = styled.div`
    display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppContainer>
        <Container>
            <Bin2Dec/>
        </Container>
    </AppContainer>
  )
}

export default App
