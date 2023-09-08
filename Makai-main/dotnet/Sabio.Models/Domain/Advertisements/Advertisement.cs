using Sabio.Models.Domain.Products;
using System;
using System.Net.Http.Headers;
namespace Sabio.Models.Domain.Advertisements
{
    public class Advertisement
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public ProductInfo Product { get; set; }
        public int OwnerId { get; set; }
        public UserInfo User { get; set; }
        public string Title { get; set; }
        public string AdMainImage { get; set; }
        public string Details { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
    }
}