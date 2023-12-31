USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[NewslettersTemplates_SelectAll]    Script Date: 5/6/2023 6:46:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Torin Harthcock
-- Create date: 21 April 2023

-- Description: Selects all newsletter templates (paginated)

-- Code Reviewer: Amanda Totin

-- MODIFIED BY:
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note: 
-- =============================================

CREATE Proc [dbo].[NewslettersTemplates_SelectAll]
	@PageIndex int
	,@PageSize int

AS

/*

	Declare @PageIndex int = 0
	Declare @PageSize int = 3


	

	Execute dbo.NewslettersTemplates_SelectAll
					@PageIndex
					,@PageSize

	

*/

Begin
Declare @offset int = @PageIndex * @PageSize

SELECT NewslettersTemplates.[Id]
      ,[Name]
      ,[Description]
      ,[PrimaryImage]
      ,NewslettersTemplates.[DateCreated]
      ,NewslettersTemplates.[DateModified]
      ,[CreatedBy]
	  ,Users.FirstName
	  ,Users.LastName
	  ,Users.Mi
	  ,Users.AvatarUrl
  ,TemplateData = (
						SELECT NewsletterTemplateKeys.KeyName as Name,
								NewsletterTemplateKeys.KeyTypeId as DataTypeId,
								NewsletterTemplateKeys.Id as TemplateKeyId
						FROM [dbo].NewsletterTemplateKeys as NewsletterTemplateKeys
						where NewsletterTemplateKeys.TemplateId = NewslettersTemplates.Id
						for JSON AUTO
						)
	  ,TotalCount = COUNT(1) OVER()
  FROM [dbo].[NewslettersTemplates] as NewslettersTemplates inner join dbo.Users as Users
  on CreatedBy = Users.Id
  ORDER BY Id

  OFFSET @offSet Rows
  Fetch Next @PageSize Rows ONLY

  END

GO
