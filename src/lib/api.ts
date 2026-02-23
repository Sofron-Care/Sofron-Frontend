import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

export type InterestPayload = {
  firstName: string;
  lastName: string;
  email: string;
  usage: "Client" | "Freelance Specialist" | "Clinic";
  clinicName?: string;
  feedback?: string;
};

export async function postInterest(data: InterestPayload) {
  const response = await fetch(`${API_BASE_URL}/interest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit interest.");
  }

  return result;
}
