using System.Collections.Generic;
using System.Text;
using System;
using Sabio.Models.Domain;


public class File
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Url { get; set; }
    public bool IsDeleted { get; set; }
    public int CreatedBy { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime DateCreated { get; set;}
    public LookUp FileType { get; set; }
}
