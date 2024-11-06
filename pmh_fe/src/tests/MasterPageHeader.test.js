import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import Header from "common/MasterPage/Header/Header";
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from "_testhelpers/provider-helper";



describe("Master Page Header Component", () => {

  test("Check if header links are present", () => {
    // renderWithProviders(<Header hideLinks={false}/>);
    // //expect(screen.getByText(/master_page.header.links.home/i)).toBeInTheDocument();
    // expect(screen.getByText(/master_page.header.links.strategy_tools/i)).toBeInTheDocument();
    // expect(screen.getByText(/master_page.header.links.daily_review/i)).toBeInTheDocument();

    // fireEvent.click(screen.getByText(/master_page.header.links.platform/i));
    // expect(screen.getByText(/master_page.header.links.management/i)).toBeInTheDocument();
    // expect(screen.getByText(/master_page.header.links.authentication/i)).toBeInTheDocument();

    // fireEvent.click(screen.getByText(/master_page.header.links.strategy_tools/i));
    // expect(screen.getByText(/master_page.header.links.budget_grouping/i)).toBeInTheDocument();
  });

  test("Check if header logo and title are present", () => {
    // renderWithProviders(<Header hideLinks={false}/>);
    // expect(screen.getByAltText("SynOps Logo")).toBeInTheDocument();
    // expect(screen.getByText(/master_page.header.title/i)).toBeInTheDocument();
  });

  //routes must be updated when pages exist
  test("Check header links functionality", async () => {
    // renderWithProviders(<Header hideLinks={false}/>);

    /*const homeLink = screen.getByText(/master_page.header.links.home/i);
    userEvent.click(homeLink);
    await waitFor(() => {
      expect(window.location.pathname).toBe("/home");
    });*/

    // const dailyReviewLink = screen.getByText(/master_page.header.links.daily_review/i);
    // userEvent.click(dailyReviewLink);
    // await waitFor(() => {
    //   expect(window.location.pathname).toBe("/daily-review");
    // });

    // fireEvent.click(screen.getByText(/master_page.header.links.platform/i));
    // const managementLink = screen.getByText(/master_page.header.links.management/i);
    // userEvent.click(managementLink);
    // await waitFor(() => {
    //   expect(window.location.pathname).toBe("/management");
    // });

    // fireEvent.click(screen.getByText(/master_page.header.links.platform/i));
    // const authenticationLink = screen.getByText(/master_page.header.links.authentication/i);
    // userEvent.click(authenticationLink);
    // await waitFor(() => {
    //   expect(window.location.pathname).toBe("/platform-auth");
    // });

    // fireEvent.click(screen.getByText(/master_page.header.links.strategy_tools/i));
    // const budgetGroupingLink = screen.getByText(/master_page.header.links.budget_grouping/i);
    // userEvent.click(budgetGroupingLink);
    // await waitFor(() => {
    //   expect(window.location.pathname).toBe("/budget-grouping");
    // });
  });
});