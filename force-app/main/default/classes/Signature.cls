global with sharing class Signature {
    @AuraEnabled
    public static String InitSignature(Id recordId){
            Account u = [select id from Account where id =: recordId];
        	String filename = 'Sign' + recordId + '.png'; 
            Attachment a = [select Id, parentId, parent.type, Body, Name from Attachment where parentId =: u.Id AND Name =: filename order by CreatedDate desc limit 1];
        if(a.Id == Null){
            system.debug('null');
            return 'false';
        }
        else{
            system.debug(a.Id);
            return a.Id;
        }
    }
    
	@AuraEnabled
    public static void saveSignature(String signatureBody, Id recordId){
        Account u = [select id from Account where id =: recordId];

        String filename = 'Sign' + recordId + '.png'; 
        
        List<Attachment> listAtt = new List<Attachment>();
        listAtt = [select Id, parentId, parent.type, Body, Name from Attachment where parentId =: u.Id AND Name =: filename];
        delete listAtt;

        
        Attachment a = new Attachment();
        a.ParentId = u.Id;
        a.Body = EncodingUtil.base64Decode(signatureBody);
        a.ContentType = 'image/png';
        a.Name = filename;
        insert a;
        system.debug(a.Id);
    }
}