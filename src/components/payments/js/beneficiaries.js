export const beneficiariesList = [
  {
    name: "Natalie Portman",
    email: "natalieport@gmail.com",
    phone: "+38 037 495 55 35",
    account: "IBAN 3257 6898 0432 3435",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+1 123 456 7890",
    account: "IBAN 9876 5432 1098 7654 3210",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+44 20 1234 5678",
    account: "IBAN GB29 NWBK 6016 1331 9268 19",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.net",
    phone: "+1 555 123 4567",
    account: "IBAN US33 CBAU 6154 8394 2913 25",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.org",
    phone: "+61 2 9876 5432",
    account: "IBAN AU61 1234 5678 9012 3456 7890",
  },
  {
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "+1 555 789 1234",
    account: "IBAN US22 ABCD 1234 5678 9012 3456",
  },
  {
    name: "Sarah Brown",
    email: "sarah@example.net",
    phone: "+44 20 5678 1234",
    account: "IBAN GB44 XYZA 9876 5432 1098 7654",
  },
  {
    name: "David Wilson",
    email: "david@example.org",
    phone: "+61 3 1234 5678",
    account: "IBAN AU98 PQRS 3456 7890 1234 5678",
  },
  {
    name: "Jennife Lee",
    email: "jennife@example.com",
    phone: "+1 555 456 7890",
    account: "IBAN US11 WXYZ 5678 9012 3456 7890",
  },
  {
    name: "Thomas Smith",
    email: "thomas@example.net",
    phone: "+44 20 9876 5432",
    account: "IBAN GB99 LMNO 4321 0987 6543 2109",
  },
  {
    name: "Jennifer Davis",
    email: "jennifer@example.org",
    phone: "+61 2 3456 7890",
    account: "IBAN AU76 EFGH 9012 3456 7890 1234",
  },
];

export const deleteBeneficiary = (id) => {
  let confirmation = confirm("Are you sure?");
  if (confirmation) {
    alert(id);
  }
};
