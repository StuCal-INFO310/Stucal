package domain;

/*Yuki Yoshiyasu */ 

public class User {
    
    private Integer userId;
    private String givenName;
    private String surname;
    private String email;
    private String username;
    private String password;

    public User(){

    }

    public User(String givenName, String surname, String email, String username, String password){
        this.givenName = givenName;
        this.surname = surname;
        this.email = email;
        this.username = username;
        this.password = password; 

    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer personId) {
        this.userId = personId;
    }


    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmailAddress(String email) {
        this.email = email;
    }

}
