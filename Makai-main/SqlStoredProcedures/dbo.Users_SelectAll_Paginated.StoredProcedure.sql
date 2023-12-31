USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectAll_Paginated]    Script Date: 5/10/2023 10:00:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author:		Bounheuangviseth, Vanhxay
-- Create date: 2/24/2023
-- Description:	Select all paginated records from dbo.Users
-- Reviewer: Christian Ramos

--Modified By: Josiah Gonzales
--Modified Date: 5/3/22
--Description: Added 2fa
--Reviewer: Santiago Llanos
-- =============================================


CREATE proc [dbo].[Users_SelectAll_Paginated]
								 @PageIndex int
								,@PageSize int



/*

	DECLARE  @PageIndex int = 0 
			,@PageSize int = 10


	Execute dbo.Users_SelectAll_Paginated
										 @PageIndex
										,@PageSize

*/




as

BEGIN

	DECLARE @Offset int = @PageIndex * @PageSize

	SELECT	u.Id
			,u.Email
			,u.Phone
			,u.FirstName
			,u.LastName
			,u.Mi 
			,u.AvatarUrl
			,u.DOB
			,Roles = ( SELECT	 r.Id
								,r.Name
						
						FROM	dbo.Roles as r inner join dbo.UserRoles as ur
										on r.Id = ur.RoleId 
						WHERE	u.Id = ur.UserId
						FOR		JSON AUTO )
			,st.Id 
			,st.Name
			,u.Is2FA
			,TotalCount = COUNT(1) OVER()
			
			
	FROM	dbo.Users as u inner join dbo.StatusTypes as st
						on u.StatusId = st.Id
			

	ORDER BY u.lastName ASC, u.firstName ASC
	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY
	
END


GO
