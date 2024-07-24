const module = angular.module("myModule", []);
const controller = module.controller("myController", function ($scope, $http) {
    $scope.utypes = ["Influencer", "Collaborator"];
    $scope.status = ["Blocked", "Active"];
    
    $scope.fetchAll = function () {
        const url = "/fetch-all-users";

        $http.get(url).then(function (resp) {
            //success callback
            if (Array.isArray(resp.data)) {
                $scope.usersAry = resp.data;
            } else { alert(resp.data); }
        }, function (resp) {
            //error callback
            alert("Error: " + resp.status + " " + resp.statusText);
        });
    };
    $scope.blockUser = function (email) {
        const url = "/block-user?email=" + email;

        $http.get(url).then(function (resp) {
            //success callback
            alert(resp.data);
        }, function (resp) {
            //error callback
            alert("Error: " + resp.status + " " + resp.statusText);
        });
        $scope.fetchAll();
    };
    $scope.unblockUser = function (email) {
        const url = "/unblock-user?email=" + email;

        $http.get(url).then(function (resp) {
            //success callback
            alert(resp.data);
        }, function (resp) {
            //error callback
            alert("Error: " + resp.status + " " + resp.statusText);
        });
        $scope.fetchAll();
    };
    $scope.deleteUser = function (email) {
        const isSure = confirm("Are you sure you want to remove this user and delete his/her data?");

        if (isSure) {
            const url = "/delete-user?email=" + email;

            $http.get(url).then(function (resp) {
                //success callback
                alert(resp.data);
            }, function (resp) {
                //error callback
                alert("Error: " + resp.status + " " + resp.statusText);
            });
            $scope.fetchAll();
        }
    };
})