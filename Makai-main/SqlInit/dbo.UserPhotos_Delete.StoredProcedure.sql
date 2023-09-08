USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserPhotos_Delete]    Script Date: 5/12/2023 7:06:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Chrystak, Tierra
-- Create date: 04/12/2023

-- Description: Delete Photo in [dbo].[UserPhotos]
-- Code Reviewer: Quinn Burch 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- =============================================

   CREATE proc [dbo].[UserPhotos_Delete]
					@Id int


   as

   /*

   Declare @Id int = 1
   Execute [dbo].[UserPhotos_Delete] @Id

  */

   BEGIN

   DELETE FROM [dbo].[UserPhotos]
   WHERE Id = @Id 


   END





GO
