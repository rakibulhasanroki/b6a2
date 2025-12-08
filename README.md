# Vehicle Rental System

## 🌐 **Live Deployment:** [https://b6a2-roan.vercel.app/](https://b6a2-roan.vercel.app/)

## Credential

```
{
    "email": "admin@testmail.com",
    "password": "@dmin5476"
}
```

## 🛠️ Technology Stack

- **Backend:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** bcrypt
- **Development Tools:** Postman (for API testing)

---

## Features

### Authentication & Authorization

- User register with email and password(email validation password check)
- Role-based access control (Admin & Customer)
- Password hashing with bcrypt

### Vehicle Management

- Check vehicles types: Car, Bike, Van, SUV
- Unique registration number needed.
- Tracking availability status
- Vehicles with active bookings can not be delete

### User Management

- Admin-only user listing
- Admin can update user role or details
- Customer can update name and phone number
- Users with active bookings can not be deleted

### Booking System

- Automatic price calculation
- Automatic vehicle availability updates
- Role-based booking visibility
- Customer cancellation (before start date)

## Getting Started

### Prerequisites

- Node.js (latest)
- PostgreSQL (latest)
- npm

### Installation

1. **Clone the repository**

   ```
   git clone
   cd
   ```

2. **Install dependencies**

   ```
    install
    npm
    express
    pg
   ```

3. **Configure environment variables**

   ```
   .env
   Edit .env with your configuration
   ```

4. **Start the server**

   ```
   npm run dev
   ```

5. **Build**
   ```
   npm run build
   ```

# URL for Testing

- Development: http://localhost:5000/api/v1
- Production: https://b6a2-roan.vercel.app/

## 🌐 API Endpoints (Method & Endpoint Only)

### **Authentication**

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/v1/auth/signup` |
| POST   | `/api/v1/auth/signin` |

---

### **Vehicles**

| Method | Endpoint                      |
| ------ | ----------------------------- |
| POST   | `/api/v1/vehicles`            |
| GET    | `/api/v1/vehicles`            |
| GET    | `/api/v1/vehicles/:vehicleId` |
| PUT    | `/api/v1/vehicles/:vehicleId` |
| DELETE | `/api/v1/vehicles/:vehicleId` |

---

### **Users**

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | `/api/v1/users`         |
| PUT    | `/api/v1/users/:userId` |
| DELETE | `/api/v1/users/:userId` |

---

### **Bookings**

| Method | Endpoint                      |
| ------ | ----------------------------- |
| POST   | `/api/v1/bookings`            |
| GET    | `/api/v1/bookings`            |
| PUT    | `/api/v1/bookings/:bookingId` |

---

### THANK YOU

**Rakibul Hasan Roki**

- Github: [@rakibulhasanroki](https://github.com/rakibulhasanroki)
