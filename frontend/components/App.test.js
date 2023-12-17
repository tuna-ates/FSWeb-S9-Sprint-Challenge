/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import React from "react"
import { render, screen } from "@testing-library/react"
import AppFunctional from "./AppFunctional"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/extend-expect"
// Write your tests here
beforeEach(()=>{
  render(<AppFunctional/>)
})
it("Yukarıya basınca kordinat metni düzgün değişiyor mu?",async()=>{
   const upButton=screen.getByTestId("up-button");
   userEvent.click(upButton)
   const message=await screen.findByText(/2, 1/)
   expect(message).toBeInTheDocument();
})
