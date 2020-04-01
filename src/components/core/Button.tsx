import styled from 'styled-components';
import { Size, mapSizeToFontSize } from '../../theme';

interface Props {
  size: Size;
  inverted?: boolean;
}

export const Button = styled.button<Props>`
  appearance: none;
  background: ${props =>
    props.inverted
      ? props.theme.color.foreground
      : props.theme.color.background};
  border: 2px
    ${props =>
      props.inverted
        ? props.theme.color.background
        : props.theme.color.foreground}
    solid;
  color: ${props =>
    props.inverted
      ? props.theme.color.background
      : props.theme.color.foreground};
  cursor: pointer;
  font-weight: bold;
  font-size: ${props => mapSizeToFontSize(props.size)};
  outline: none;
`;