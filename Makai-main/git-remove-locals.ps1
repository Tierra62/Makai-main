﻿
clear
$scriptpath = $MyInvocation.MyCommand.Path
$dir = Split-Path $scriptpath

cd $dir

$local=git branch -l
$remote=git branch -r
$local|
    %{$_.Trim()}|
    ?{-not ($remote -like '*' + $_) }|
    ?{-not($_ -match "master" )}|
    %{git branch -D $_}