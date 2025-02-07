# Salon Management System

A modern, full-featured salon management system built with React and TypeScript.

## Features

- 📅 **Appointment Management**
  - Book and manage client appointments
  - View daily/weekly schedule
  - Time slot selection
  - Service duration tracking

- 👥 **Client Management**
  - Client profiles with contact information
  - Visit history
  - Total spend tracking
  - Search and filter clients

- 💇‍♀️ **Stylist Management**
  - Stylist profiles
  - Service assignments
  - Specialization tracking
  - Contact information

- 🛍️ **POS (Point of Sale)**
  - Quick service selection
  - Multiple payment methods (Cash, Card, UPI, BNPL)
  - GST handling
  - Order management

- 📦 **Services Management**
  - Create and manage service catalog
  - Set prices and duration
  - Service descriptions
  - Category organization

- 📝 **Order Management**
  - Order tracking
  - Payment status
  - Fulfillment status
  - Order notes
  - Search and filter orders

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd salon-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Technology Stack

- **Frontend Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Data Persistence**: LocalStorage
- **Icons**: Lucide Icons
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── lib/              # Utility functions
└── App.tsx           # Main application component
```

## Features in Detail

### Appointment Management
- Interactive calendar for date selection
- Time slot management
- Service duration consideration
- Client assignment

### Client Management
- Detailed client profiles
- Visit history tracking
- Spending analytics
- Easy search and filtering

### POS System
- Quick service selection
- Multiple payment methods
- Tax handling
- Order creation and management

### Service Management
- Service catalog
- Price and duration settings
- Service categorization

### Order Tracking
- Complete order history
- Payment status tracking
- Fulfillment status
- Order notes and updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
