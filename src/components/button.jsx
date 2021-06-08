import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  height: 48px;
  background: #ff3636 0% 0% no-repeat padding-box;
  border-radius: 200px;
  color: white;
  font-size: 16px;
  border: none;

  &:disabled,
  &:invalid {
    color: black;
  }
`;

export default Button;
