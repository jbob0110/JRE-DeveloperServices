var jiraKey;
var project;
var jiraInstance;
var url;
var gIssueType;
var gComp;
var gSolution;
var gSolutionDetail;
var gJiraGroup;
// asyncRequestCount keeps track of when the sub-tasks are being sent.
var asyncRequestCount = 0;

/**This if checks the users browser and grabs their browser information based on this.*/
chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
  url = tabs[0].url;
  tabId = tabs[0].id;
  values = getURLs(url);
  jiraKey = values['jiraKey'];
  project = values['project'];
  jiraInstance = values['jiraInstance'];
  console.log(tabId);
  console.log("jira key: " + jiraKey);
  console.log("jira project: " + project);
  console.log("jira instance: " + jiraInstance);
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: getValuesDevWorkflow,
  })
  .then(injectionResults => {
    for (const {result} of injectionResults) {
      gIssueType = result['issueType'];
      gComp = result['components'];
      gSolution = result['solution'];
      gSolutionDetail = result['solutionDetail'];
      gJiraGroup = result ['jiraGroup'];
    };
    console.log("issue type: " + gIssueType);
    console.log("component: " + gComp);
    console.log("solution: " + gSolution);
    console.log("solution detail: " + gSolutionDetail);
    console.log("jira group: " + gJiraGroup);
  });
});

function getValuesDevWorkflow(){
  return {
    issueType: document.getElementById('type-val').innerText,
    components: document.getElementById('components-val').innerText,
    solution: document.getElementById('customfield_14800-val').innerText,
    solutionDetail: document.getElementById('customfield_14801-val').innerText,
    jiraGroup: document.getElementById('customfield_14802-val').innerText,
  }
};

window.onload = () => {
  document.getElementById('BTNaddSubTasks').onclick = () => {
    document.getElementById('loader').style.display = "block";

    if (project === 'DFDW' && gIssueType === ' Spike' && gJiraGroup === 'DW: Andromeda') {
      addSubTask({
        "fields":{
          "project":{  "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{  "name":"Sub-task"},
          "summary": pkSummary,
          "description": pkDescription,
        }
      });
    console.log("ANDR Spike");
    } else if ((project === 'DFDW' && gIssueType !== ' Spike' && gJiraGroup !== 'DW: Andromeda') || (project === 'DIST' && gIssueType !== ' Spike')) {
      addSubTask({
        "fields":{  
          "project":{  "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{  "name":"Sub-task"},
          "summary": dSummary,
          "description": dDescription,
        }
      });              
      addSubTask({
        "fields":{  
          "project":{  "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{  "name":"Sub-task"},
          "summary": rSummary,
          "description": rDescription,
        }
      });
      addSubTask(
        {"fields":{
          "project":{  "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{  "name":"Sub-task"},
          "summary": riSummary,
          "description": riDescription,
        }
      });
      addSubTask({
        "fields":{
          "project":{  "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{  "name":"Sub-task"},
          "summary": cSummary,
          "description": cDescription,
        }
      });
      addSubTask({
        "fields":{
          "project":{  "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{  "name":"Sub-task"},
          "summary": crSummary,
          "description": crDescription,
        }
      });
      addSubTask({
        "fields":{
          "project":{  "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{  "name":"Sub-task"},
          "summary": tdSummary,
          "description": tdDescription,
        }
      });
      console.log("DFDW Story || DIST Story");
    } else if (project === 'DFDW' && gIssueType !== ' Spike' && gJiraGroup === 'DW: Andromeda') {
        addSubTask({
          "fields":{  
          "project":{ "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{ "name":"Sub-task"},
          "summary": dSummary,
          "description": dDescription,
          }
        });              
      addSubTask({
        "fields":{  
          "project":{ "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{ "name":"Sub-task"},
          "summary": rSummary,
          "description": rDescription,
        }
      });
      addSubTask({
        "fields":{
          "project":{ "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{ "name":"Sub-task"},
          "summary": riSummary,
          "description": riDescription,
        }
      });
      addSubTask({
        "fields":{
          "project":{ "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{ "name":"Sub-task"},
          "summary": cSummary,
          "description": cDescription,
        }
      });
      addSubTask({
        "fields":{
          "project":{ "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{ "name":"Sub-task"},
          "summary": crSummary,
          "description": crDescription,
        }
      });
      addSubTask({
        "fields":{
          "project":{ "key": project },
          "parent":{ "key": jiraKey},
          "issuetype":{ "name":"Sub-task"},
          "summary": tdSummary,
          "description": tdDescription,
        }
      });
      addSubTask({
        "fields":{
          "project": { "key": project },
          "parent": { "key": jiraKey },
          "issuetype": { "name":"Sub-task" },
          "summary": pkSummary,
          "description": pkDescription,
        }
      });
    console.log("Andromeda Story");
    } else {
      window.alert("can't add sub-tasks");
      window.close();
    };
  };
};


function getURLs(url){
  var re = /https\:\/\/(.+?)\..+\/((.+?)\-[^\?]+)/;
  var regexGroups = { jIns: 1, jKey: 2, pKey: 3 };
  var m = re.exec(url);
  return {
    jiraKey: m[regexGroups.jKey],
    project: m[regexGroups.pKey],
    jiraInstance: m[regexGroups.jIns],
  }
};

function addSubTask(subtask){
  var xhr = new XMLHttpRequest;
  xhr.open("POST", "https://"+jiraInstance+".cerner.com/rest/api/2/issue/");
  xhr.setRequestHeader("Content-Type","application/json","Access-Control-Allow-Origin");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
      asyncRequestCount--;
      checkAsynRequestCount();
    }
  };
  asyncRequestCount++;
  xhr.send(JSON.stringify(subtask));
};

/** This function checks if the asyncRequestCount is 0 then will reload the page, and hide the loading spinner*/
function checkAsynRequestCount(){
  if(asyncRequestCount === 0){
    chrome.tabs.reload();
    document.getElementById('loader').style.display = "none";
  }
};


/** addSubTask 'Requirements' Sub-Task specific values */
let rSummary =  "Requirements";
let rDescription = "- Link to signed, finalized requirements covering this issue \n OR \n - Short comment on why this issue did not require requirements \n\n  Note: If the issue is a defect, please reference the original requirements covering this functionality along with the Jira Number that introduced this defect";

/** addSubTask 'Documentation' Sub-Task specific values */
let dSummary = "Documentation";
let dDescription = "- Link to help documentation that was created or change due to this issue \n OR \n - Confirmation no help documentation needed to be created or updated due to this issue";

/** addSubTask 'Release Information' Sub-Task specific values */
let riSummary = "Release Information";
let riDescription = "The Developer should work with the PO or PO Delegate to provide the following information needed for the release of this issue:\n - Will this issue release on its own, or part of a larger epic? \n - Will the release of this issue cause any performance impacts (IF, PD, Down). If so, to what and for how long? \n - Should this change be announced to users? \n - Will any resources outside of the development team be needed to assist in the deployment to production? If so, whom?";

/** addSubTask 'Tech Design' Sub-Task specific values */
let tdSummary = "Tech Design";
let tdDescription = "- Link to reviewed and approved tech design covering this issue \n OR \n - Short comment on why this issue did not require a tech design \n\n Note: If the issue is a defect, please reference the original tech design covering this functionality along";

/** addSubTask 'Code Review' Sub-Task specific values*/
let crSummary = "Code Review";
let crDescription = "- Link to the reviewed and signed Code Review \n OR \n - Short comment on why this issue did not require a code review";

/** addSubTask 'Certification' Sub-Task specific values */
let cSummary = "Certification";
let cDescription = "- Link to test runs (including if there were failed runs), to the eventual successful test run \n OR \n - Attached screenshots of test runs (including if there were failed runs), to the eventual successful test run \n OR \n - Short comment on why this issue did not require certification";

/** addSubTask 'Project Kickoff' Sub-Task specific values */
var pkSummary = "Project Kickoff";
var pkDescription = "- List the general planned code changes, and give any helpful context about why. \n- List APIs to update or create. \n- List expected test cases (how will we verify this?). Check to see if test data that is needed is available or needs to be created, especially if it will require outside help to create. \n- Anything additional the developer thinks needs to be shared with the team.";
