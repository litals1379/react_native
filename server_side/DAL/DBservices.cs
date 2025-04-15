//using Microsoft.Data.SqlClient;  

//public class UserDBservices
//{
//    private readonly SqlConnection _sqlConnection;

//    public UserDBservices(SqlConnection sqlConnection)
//    {
//        _sqlConnection = sqlConnection;
//    }

//    public void SomeSqlMethod()
//    {
//        _sqlConnection.Open();
//        // כאן תבצעי שאילתות SQL, לדוגמה:
//        SqlCommand cmd = new SqlCommand("SELECT * FROM Users", _sqlConnection);
//        var reader = cmd.ExecuteReader();

//        while (reader.Read())
//        {
//            Console.WriteLine(reader["UserName"]);  // כאן תבצעי פעולה עם הנתונים
//        }

//        _sqlConnection.Close();
//    }
//}
