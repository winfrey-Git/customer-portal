// ---- LOGIN USER ----
export async function loginUser(email: string, password: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Temporary fake login check
      if (email === "test@customer.com" && password === "123456") {
        resolve({
          token: "fake-jwt-token",
          email,
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
}

// ---- CUSTOMER REQUEST PORTAL ACCESS ----
export interface CustomerRequest {
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  vatNumber?: string;
}

export async function requestPortalAccess(data: CustomerRequest) {
  return new Promise((resolve) => {
    console.log("Request saved:", data);
    setTimeout(() => resolve(true), 1000);
  });
}


// ---- ACTIVATE ACCOUNT (FOR REGISTRATION FLOW) ----
export async function activateAccount(token: string, password: string) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error("Invalid or expired activation token"));
      return;
    }

    console.log("Account activated:", {
      token,
      password,
    });

    setTimeout(() => resolve(true), 1000);
  });
}
