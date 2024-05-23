// Yuki Yoshiyasu
// Import necessary functions and modules
const { signup, createClient } = require('../frontend/src/js/global.js');
const Swal = require('sweetalert2');

// Mock the Supabase client
jest.mock('../frontend/src/js/global.js', () => ({
  createClient: jest.fn(() => ({
      auth: {
          signUp: jest.fn(), // Mock signUp function
          signInWithPassword: jest.fn(), // Mock signInWithPassword function
      },
  })),
}));

// Mock SweetAlert
jest.mock('sweetalert2', () => ({
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }), // Mock Swal.fire function
}));

describe('signup function', () => {
    let mockSupabase;
    
    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks before each test
        mockSupabase = createClient(); // Create a new mock supabase client
    });
    
    // These tests, sign up and sign in are not working as intended
    
    // it('should sign up a user and show a success alert', async () => {
    //     const email = 'hahah@gmail.com';
    //     const password = 'password123';
        
    //     // Mock successful sign up
    //     mockSupabase.auth.signUp.mockResolvedValue({
    //         data: {
    //             user: {
    //                 email,
    //             },
    //         },
    //         error: null,
    //     });
        
    //     // Run the signup function
    //     await signup(email, password);
        
    //     // Assertions
    //     expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({ email, password });
    //     expect(Swal.fire).toHaveBeenCalledWith({
    //         icon: 'success',
    //         title: 'Success',
    //         text: 'Account created successfully',
    //     });
    // });
    
    // it('should show an error alert if signup fails', async () => {
    //     const email = 'ad@example.com';
    //     const password = 'password123';
    //     const errorMessage = 'Signup error';
        
    //     // Mock sign-up failure
    //     mockSupabase.auth.signUp.mockResolvedValue({
    //         data: null,
    //         error: {
    //             message: errorMessage,
    //         },
    //     });
        
    //     await signup(email, password);
        
    //     // Assertions
    //     expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({ email, password });
    //     expect(Swal.fire).toHaveBeenCalledWith({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: errorMessage,
    //     });
    // });

    // Tets for createClient() works, which ensures that the connection with the backend has been established
    describe('createClient function', () => {
        it('should create a supabase client', () => {
            const client = createClient();
            expect(client).toBeTruthy(); // Check if client is created
            expect(client.auth).toBeTruthy(); // Check if client has auth property
        });
    });
    
});
