import React from "react";
import styled from "styled-components";
import { ReactComponent as Loader } from "../assets/icons/loader.svg";

const ButtonTemplate = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 200px;
  color: white;
  font-size: 16px;
  border: none;
  display: flex;
  align-items: center;
  position: relative;

  &:disabled,
  &:invalid {
    color: black;
  }
`;

const StyledLoader = styled(Loader)`
  width: 50px;
  left: 10px;
  position: absolute;
`;

export const OutlineButton = styled(ButtonTemplate)`
  background: transparent;
  border: 2px solid #ffffff;
`;

export const PrimaryButton = styled(ButtonTemplate)`
  background: ${({ loading }) => (loading ? "#DEAFAF" : "#ff3636")};
`;

export const ButtonContent = styled.span`
  flex: 1 0 auto;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const BUTTONS = {
  outline: OutlineButton,
  primary: PrimaryButton,
};

export default function Button({ theme = "primary", loading, children, ...props }) {
  const Component = BUTTONS[theme];

  return (
    <Component loading={loading} {...props}>
      {loading && <StyledLoader />} <ButtonContent>{children}</ButtonContent>
    </Component>
  );
}
