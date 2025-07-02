import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { CrawlResultsTable } from "@/components/crawl-results-table"
import type { CrawlResult } from "@/types/crawler"
import jest from "jest" // Import jest to declare the variable

const mockResults: CrawlResult[] = [
  {
    id: "1",
    url: "https://example.com",
    status: "completed",
    createdAt: "2024-01-01T00:00:00Z",
    data: {
      htmlVersion: "HTML5",
      title: "Example Site",
      headingCounts: { h1: 1, h2: 3, h3: 5, h4: 0, h5: 0, h6: 0 },
      internalLinks: 25,
      externalLinks: 10,
      brokenLinks: [],
      hasLoginForm: false,
    },
  },
  {
    id: "2",
    url: "https://test.com",
    status: "running",
    createdAt: "2024-01-02T00:00:00Z",
    data: null,
  },
]

const defaultProps = {
  results: mockResults,
  selectedUrls: new Set<string>(),
  onSelectionChange: jest.fn(),
  onRowClick: jest.fn(),
  onStart: jest.fn(),
  onStop: jest.fn(),
}

describe("CrawlResultsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders table with results", () => {
    render(<CrawlResultsTable {...defaultProps} />)

    expect(screen.getByText("https://example.com")).toBeInTheDocument()
    expect(screen.getByText("https://test.com")).toBeInTheDocument()
    expect(screen.getByText("Example Site")).toBeInTheDocument()
  })

  it("handles row selection", () => {
    render(<CrawlResultsTable {...defaultProps} />)

    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[1]) // First result checkbox (index 0 is select all)

    expect(defaultProps.onSelectionChange).toHaveBeenCalledWith(new Set(["1"]))
  })

  it("handles select all functionality", () => {
    render(<CrawlResultsTable {...defaultProps} />)

    const selectAllCheckbox = screen.getAllByRole("checkbox")[0]
    fireEvent.click(selectAllCheckbox)

    expect(defaultProps.onSelectionChange).toHaveBeenCalledWith(new Set(["1", "2"]))
  })

  it("shows correct action buttons based on status", () => {
    render(<CrawlResultsTable {...defaultProps} />)

    // Should show pause button for running status
    const pauseButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg")?.classList.contains("lucide-pause"))
    expect(pauseButtons).toHaveLength(1)
  })

  it("handles row click", () => {
    render(<CrawlResultsTable {...defaultProps} />)

    const firstRow = screen.getByText("https://example.com").closest("tr")
    fireEvent.click(firstRow!)

    expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockResults[0])
  })

  it("displays correct status badges", () => {
    render(<CrawlResultsTable {...defaultProps} />)

    expect(screen.getByText("completed")).toBeInTheDocument()
    expect(screen.getByText("running")).toBeInTheDocument()
  })

  it("shows pagination when needed", () => {
    const manyResults = Array.from({ length: 15 }, (_, i) => ({
      ...mockResults[0],
      id: i.toString(),
      url: `https://example${i}.com`,
    }))

    render(<CrawlResultsTable {...defaultProps} results={manyResults} />)

    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument()
    expect(screen.getByText("Next")).toBeInTheDocument()
  })
})
