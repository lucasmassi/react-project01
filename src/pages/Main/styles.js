import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  max-width: 700px;
  background: #FFF;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

export const Form = styled.form.attrs(props => props.error)`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: 1px solid #eee;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
  }

  ${props =>
    props.error &&
    css`
      input {
        border-color: #ff5447;
      }
    `}
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading ? true : false,
}))`
  background: #ff9021;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & + li {
       border-top: 1px solid #eee
    }

    a {
      color: #ff9021;
      text-decoration: none;
      font-weight: bold;
      padding: 5px;
      border: 1px solid #fff;
      border-bottom: 2px solid #fff;
    }

    a:hover {
      border: 1px solid #ff9021;
      border-radius: 4px;
      border-bottom: 2px solid #ff9021;
    }
  }
`;

export const ErrorMessage = styled.p`
  ${props =>
    props.error ?
      css`
      display: flex;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #ff5447;
      font-size: 15px;
      font-weight: bold;
      flex-direction: row;
    ` :
      css`
      display:none
    ` }
`;
