import React, { Component } from "react";

// Define the shape of the component's state
interface LiveClockUpdateState {
  date: Date;
}

// Define the LiveClockUpdate class component
class LiveClockUpdate extends Component<{}, LiveClockUpdateState> {
  // Declare a private property to store the timer ID
  private timerID: NodeJS.Timeout | null = null;

  // Constructor to initialize the component
  constructor(props: {}) {
    super(props);

    // Initialize the state with the current date
    this.state = { date: new Date() };
  }

  // Lifecycle method called after the component is mounted
  componentDidMount() {
    // Set up an interval to call the tick method every second (1000ms)
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  // Lifecycle method called before the component is unmounted
  componentWillUnmount() {
    // Clear the interval if it exists to prevent memory leaks
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  // Method to update the state with the current date
  tick() {
    this.setState({
      date: new Date(),
    });
  }

  // Render method to display the component
  render() {
    return (
      <div>
        {/* Display the current time as a localized string */}
        <p className="text-[10px]">{this.state.date.toLocaleTimeString()}</p>
      </div>
    );
  }
}

// Export the LiveClockUpdate component as the default export
export default LiveClockUpdate;
