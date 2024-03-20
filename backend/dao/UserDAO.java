package dao;

import domain.User;

/*Yuki Yoshiyasu */ 
public interface UserDAO{

    void saveUser(User user);

    void removeUser(User user);

    User getUserByUsername(String username);

    boolean verifyCredentials(String username, String password);
    
}