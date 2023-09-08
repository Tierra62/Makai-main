using System.Collections.Generic;
using System.Text;
using System;
using Sabio.Models.Domain;
using System.ComponentModel.DataAnnotations;

public class FileSelectByTypesRequest
{
    [Required]
    [Range(0,int.MaxValue)]
    public int PageIndex { get; set; }
    [Required]
    [Range(1, int.MaxValue)]
    public int PageSize { get; set; }
    public List<int> FileTypes { get; set; }
}

