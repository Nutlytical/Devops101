import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);

  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const clickOnSubmitButton = () => {
  const submitButtonElement = screen.getByRole("button", {
    name: /submit/i,
  });
  userEvent.click(submitButtonElement);
};

describe("App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("should be initialized empty", () => {
    const emailInputElement = screen.getByRole("textbox");
    const passwordInputElement = screen.getByLabelText("Password");
    const confirmPasswordInputElement =
      screen.getByLabelText(/confirm password/i);

    expect(emailInputElement.value).toBe("");
    expect(passwordInputElement.value).toBe("");
    expect(confirmPasswordInputElement.value).toBe("");
  });

  describe("Type handling", () => {
    it("should be able to type an email", () => {
      const { emailInputElement } = typeIntoForm({
        email: "abc123@gmail.com",
      });

      expect(emailInputElement.value).toBe("abc123@gmail.com");
    });

    it("should be able to type a password", () => {
      const { passwordInputElement } = typeIntoForm({ password: "abc123" });

      expect(passwordInputElement.value).toBe("abc123");
    });

    it("should be able to type a confirm password", () => {
      const { confirmPasswordInputElement } = typeIntoForm({
        confirmPassword: "abc123",
      });

      expect(confirmPasswordInputElement.value).toBe("abc123");
    });
  });

  describe("Error handling", () => {
    it("should show email error message on invalid email", () => {
      const emailErrorElement = screen.queryByText(
        /the email you input is invalid/i
      );

      expect(emailErrorElement).not.toBeInTheDocument();
      typeIntoForm({ email: "abc123.com" });
      clickOnSubmitButton();

      const emailErrorElementAgain = screen.queryByText(
        /the email you input is invalid/i
      );

      expect(emailErrorElementAgain).toBeInTheDocument();
    });

    it("should show password error message if password is less than 5 characters", () => {
      const passwordErrorElement = screen.queryByText(
        /the email you entered should contain 5 or more characters/i
      );

      expect(passwordErrorElement).not.toBeInTheDocument();
      typeIntoForm({ email: "abc123@gmail.com", password: "abc" });
      clickOnSubmitButton();

      const passwordErrorElementAgain = screen.queryByText(
        /the email you entered should contain 5 or more characters/i
      );

      expect(passwordErrorElementAgain).toBeInTheDocument();
    });

    it("should show confirm password error message if password don't match", () => {
      const confirmPasswordErrorElement = screen.queryByText(
        /the passwords don't match. try again/i
      );

      expect(confirmPasswordErrorElement).not.toBeInTheDocument();
      typeIntoForm({
        email: "abc123@gmail.com",
        password: "abc123",
        confirmPassword: "abc1234",
      });
      clickOnSubmitButton();

      const confirmPasswordErrorElementAgain = screen.queryByText(
        /the passwords don't match. try again/i
      );

      expect(confirmPasswordErrorElementAgain).toBeInTheDocument();
    });

    it("should show no error message if every input is valid", () => {
      typeIntoForm({
        email: "abc123@gmail.com",
        password: "abc123",
        confirmPassword: "abc123",
      });
      clickOnSubmitButton();

      const emailErrorElement = screen.queryByText(
        /the email you input is invalid/i
      );
      const passwordErrorElement = screen.queryByText(
        /the email you entered should contain 5 or more characters/i
      );
      const confirmPasswordErrorElement = screen.queryByText(
        /the passwords don't match. try again/i
      );

      expect(emailErrorElement).not.toBeInTheDocument();
      expect(passwordErrorElement).not.toBeInTheDocument();
      expect(confirmPasswordErrorElement).not.toBeInTheDocument();
    });
  });
});
