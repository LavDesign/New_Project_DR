import React from "react";
import { screen, render } from "@testing-library/react";
import Footer from "common/Footer/Footer";

describe("Footer Component", () => {
  test("Check whether the text is present or not", () => {
    render(<Footer />);
    expect(screen.getByText(/site_texts.all_rights_reserved/i)).toBeInTheDocument();
  });
});
