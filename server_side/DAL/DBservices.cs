using System.Data.SqlClient;
using System;
using System.Collections.Generic; // Add this for List<string>

public class DBservices
{
    private readonly SqlConnection _msSqlConnection;

    // קונסטרוקטור המתחבר למסד הנתונים
    public DBservices(string connectionString)
    {
        _msSqlConnection = new SqlConnection(connectionString);
    }

    public List<string> GetRandomWords()
    {
        List<string> words = new List<string>();
        try
        {
            _msSqlConnection.Open();

            // קריאה ל- Stored Procedure GetRandomWords
            SqlCommand cmd = new SqlCommand("EXEC GetRandomWords", _msSqlConnection);
            SqlDataReader reader = cmd.ExecuteReader(); // Use SqlDataReader

            // איסוף המילים שנשלפו
            while (reader.Read())
            {
                words.Add(reader["word"].ToString());
            }

            reader.Close(); // explicitly close the reader
        }
        catch (Exception ex)
        {
            Console.WriteLine($"שגיאה: {ex.Message}");
            return new List<string>();
        }
        finally
        {
            _msSqlConnection.Close();
        }
        return words;
    }
}