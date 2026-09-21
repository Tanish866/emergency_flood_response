# 🚨 ResQFlow

An emergency flood response and coordination platform designed to help citizens during flood situations by connecting them with rescue teams, evacuation shelters, alerts, and safe evacuation routes.

The project provides separate interfaces for:

- 👤 Citizens
- 🚤 Rescue Teams
- 🛡️ Administrators

It is built as a full-stack web application with a React frontend and Node.js/Express backend.

---

## 🌊 Project Overview

During a flood emergency, people often face difficulty finding:

- Nearby rescue teams
- Available shelters
- Safe evacuation routes
- Flood risk information
- Emergency assistance
- Important flood alerts

**Emergency Flood Response** aims to provide these capabilities through a single platform.

The system allows citizens to request emergency assistance while rescue teams can view and respond to requests. Administrators can monitor and manage the overall system.

---

## ✨ Main Features

### 👤 Citizen Interface

Citizens can:

- Create an account
- Login / Logout
- View flood alerts
- View their current location
- View flood risk zones
- Find nearby shelters
- Check shelter availability
- Find nearby rescue teams
- Request emergency assistance
- Track rescue requests
- View evacuation routes
- Report hazards

---

### 🚤 Rescue Team Interface

Rescue teams can:

- Login to the system
- View assigned emergency requests
- View active emergency requests
- See citizen locations
- View nearby rescue requests
- Accept/assign emergency requests
- Update rescue request status
- Track emergency locations on the map
- View evacuation and risk information

Typical request states:

```text
Pending
   ↓
Assigned
   ↓
En Route
   ↓
Arrived
   ↓
Resolved
