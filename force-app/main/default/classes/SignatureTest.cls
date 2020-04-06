@isTest
Private class SignatureTest {
    
    @isTest static void test_method_one() {
        Id p = [select id from profile where name='Partner Community User Smile'].id;
       
        Account ac = new Account(name ='Test') ;
        insert ac; 
       
        Contact con = new Contact(LastName ='testCon',AccountId = ac.Id, Email = 'test@test.com');
        insert con;  
                  
        User user = new User(alias = 'test123', email='test123@noemail.com',
                emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                localesidkey='en_US', profileid = p, country='United States',IsActive =true,
                ContactId = con.Id,
                timezonesidkey='America/Los_Angeles', username='tester@noemail.com');
       
        insert user;
        system.runAs(user) {
           Test.StartTest();
            		Signature.saveSignature('Test',user.Id);
            		Signature.InitSignature(user.Id);
		   Test.StopTest();
        }
        
    }

}