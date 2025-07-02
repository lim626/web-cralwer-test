import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import WebCrawlerDashboard from "@/app/page"
import jest from "jest" // Import jest to declare the variable

// Mock the toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe("WebCrawlerDashboard", () => {
  it("renders dashboard title and description", () => {
    render(<WebCrawlerDashboard />)

    expect(screen.getByText("Web Crawler Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Analyze websites and track crawling progress")).toBeInTheDocument()
  })

  it("allows adding new URLs", async () => {
    render(<WebCrawlerDashboard />)

    const urlInput = screen.getByPlaceholderText("Enter website URL...")
    const addButton = screen.getByText("Add URL")

    fireEvent.change(urlInput, { target: { value: "https://example.com" } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument()
    })
  })

  it("shows status overview cards", () => {
    render(<WebCrawlerDashboard />)

    expect(screen.getByText("All")).toBeInTheDocument()
    expect(screen.getByText("Queued")).toBeInTheDocument()
    expect(screen.getByText("Running")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
  })

  it("handles search functionality", async () => {
    render(<WebCrawlerDashboard />)

    // Add a URL first
    const urlInput = screen.getByPlaceholderText("Enter website URL...")
    const addButton = screen.getByText("Add URL")

    fireEvent.change(urlInput, { target: { value: "https://example.com" } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument()
    })

    // Test search
    const searchInput = screen.getByPlaceholderText("Search URLs or titles...")
    fireEvent.change(searchInput, { target: { value: "example" } })

    expect(screen.getByText("https://example.com")).toBeInTheDocument()
  })

  it("validates URL input", async () => {
    render(<WebCrawlerDashboard />)

    const urlInput = screen.getByPlaceholderText("Enter website URL...")
    const addButton = screen.getByText("Add URL")

    fireEvent.change(urlInput, { target: { value: "invalid-url" } })
    fireEvent.click(addButton)

    // Should not add invalid URL to the table
    expect(screen.queryByText("invalid-url")).not.toBeInTheDocument()
  })
})
