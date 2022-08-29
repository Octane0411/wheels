import React, {Fragment, useState} from 'react';
import styled from "styled-components";

const VerticalContainer = styled.div`
    display: flex;
    flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Input = styled.input`
  height: 200px;
  width: 300px;
  padding: 0;
  border: 1px solid black;
  font-size: 48px;
`
const Button = styled.button`
  width: 130px;
  height: 100px;
  border-radius: 5px;
  outline: none;
`
const Error = styled.p`
    color: red;
`
const validBinary = (str) => {
    for (const ch of str) {
        if (ch !== "0" && ch !== "1") {
            return false
        }
    }
    return true
}
const parseBinary = (str) => {
    let arr = str.split("").map(Number)
    let res = arr.reduceRight((prev, cur, index) => {
        if (cur === "0") {
            return prev
        } else {
            return prev + Math.pow(2, arr.length - index -1)
        }
    }, 0)
    return res
}

const Bin2Dec = () => {
    const [res, setRes] = useState(0)
    const [valid, setValid] = useState(true)
    const [input, setInput] = useState("")
    const onInput = (e) => {
        let str = e.target.value
        let isValid = validBinary(str)
        setValid(isValid)
        if (isValid) {
            setInput(str)
        }
    }
    const onClick = () => {
        let num = parseBinary(input)
        setRes(num)
        console.log(num)
    }
    return (
        <VerticalContainer>
            <Container>
                <Input onChange={onInput} value={input}/>
                <Button onClick={onClick} disabled={!valid}>
                    点我转换
                </Button>
                <Input disabled={true} value={res} onChange={() => res}/>
            </Container>
            {!valid? <Error>请输入0或1</Error>: null}
        </VerticalContainer>
    );
};

export default Bin2Dec;
