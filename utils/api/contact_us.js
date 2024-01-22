export async function submitContactForm(formData) {
  const response = await fetch("/api/contactUs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to send email.");
  }

  return response.json();
}
