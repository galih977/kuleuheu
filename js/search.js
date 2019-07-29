$( document ).ready(function() {
    InitializeSkillSearch();
    SearchGetAllSkills();
    InitializeCardSearch();
    SearchGetAllCards();
  });
  
  //searchbar
  let sjs = SimpleJekyllSearch(
  {
    searchInput: document.getElementById("nav_searchbar"),
    resultsContainer: document.getElementById("results-container"),
    json: "/data/search.json",
    searchResultTemplate:
      '<a href="{url}" title="{description}" class="list-group-item list-group-item-action">{title}</a>',
    limit: 15
  });
  
  //globalVar
  let processedCards = [];
  const maxDisplayedCards=200;
  //Card search
  function InitializeCardSearch() {
    nav_timeoutId = 0;
    obtainJson = getGlobalObtainJson();
  
    Promise.resolve(obtainJson).then((result) => {
      obtainJson = result;
    });
  
    CardSearchView = {
      cardsNAV: ko.observableArray(),
      searchTermNAV: ko.observable(""),
      filteredCardsNAV: ko.observableArray(),
  
      GetCardUrl: function(name) {
        return new CardsAPI().getImageURL(name);
      }
    };
  
    CardSearchView.searchTermNAV.subscribe(function(searchTermNAV) {
      clearTimeout(nav_timeoutId);
  
      if (searchTermNAV.length >= 2) {
        processedCards = [];
        nav_timeoutId = setTimeout(function() {
          let lowerSearchTerm = searchTermNAV.toLowerCase();
  
          let nameResults = $(CardSearchView.cardsNAV()).filter(function() {
            return this.nameSearch.indexOf(lowerSearchTerm) != -1;
          });
  
          let descResults = $(CardSearchView.cardsNAV()).filter(function() {
            if (this.description != null) {
              return this.description.indexOf(lowerSearchTerm) != -1;
            }
          });
  
          //sorting/remove duplicates
          let sortNameRes = sortCards(nameResults);
          let sortDescRes = sortCards(descResults);
  
          let nameResInGame = sortNameRes[0];
          let nameResNotInGame = sortNameRes[1];
          let descResInGame = sortDescRes[0];
          let descResNotInGame = sortDescRes[1];
  
          let mergedIngame = nameResInGame.concat(descResInGame);
          let mergedNotIngame = nameResNotInGame.concat(descResNotInGame);
          let mergedAll = mergedIngame.concat(mergedNotIngame);
  
          CardSearchView.filteredCardsNAV(mergedAll.slice(0, maxDisplayedCards));
          let is_mobile = isMobile();
  
          updatePopupsForDesktops();
          numberOfCardsFound=0;
        }, 0);
      } else {
        CardSearchView.filteredCardsNAV([]);
      }
    });
  
    ko.applyBindings(CardSearchView, document.getElementById("nav_search_cards"));
  }
  
  function SearchGetAllCards() {
    $.getJSON("/data/cards.json", function(data) {
      CardSearchView.cardsNAV(data);
    });
  }
  
  function cardIsObtainable(cardName)
  {
      return obtainJson.filter(c => c.nameSearch === cardName).length > 0;
  }
  
  let numberOfCardsFound=0;
  function sortCards(array) {
    let cardsInGame = [];
    let cardsNotInGame = [];
    for (let i = array.length - 1; i >= 0; i--) {
      if(numberOfCardsFound<maxDisplayedCards){
        if (processedCards.indexOf(array[i].name) < 0) {
          if (cardIsObtainable(array[i].nameSearch)) {
            cardsInGame.push(array[i]);
            processedCards.push(array[i].name);
            numberOfCardsFound++;
          } else {
            cardsNotInGame.push(array[i]);
            processedCards.push(array[i].name);
          }
        }
      }
      else{
        break;
      }
    }
    return [cardsInGame, cardsNotInGame];
  }
  
  
  function InitializeSkillSearch() {
    nav_timeoutId = 0;
  
    SkillSearchView = {
      skills: ko.observableArray(),
      searchTermNAV: ko.observable(""),
      filteredSkills: ko.observableArray()
    };
  
    SkillSearchView.searchTermNAV.subscribe(function(searchTermNAV) {
      clearTimeout(nav_timeoutId);
  
      if (searchTermNAV.length >= 2) {
        nav_timeoutId = setTimeout(function() {
          let lowerSearchTerm = searchTermNAV.toLowerCase();
  
          let nameResults = $(SkillSearchView.skills()).filter(function() {
            return this.name.toLowerCase().indexOf(lowerSearchTerm) != -1;
          });
  
          let skillResults = []
          for (let i = 0; i < nameResults.length; i++)
          {
            skillResults.push(nameResults[i]);
          }
  
          let descResults = $(SkillSearchView.skills()).filter(function() {
            if (this.desc != null) {
              return this.desc.toLowerCase().indexOf(lowerSearchTerm) != -1;
            }
          });
          for (let i = 0; i < descResults.length; i++)
          {
            if (!skillResults.includes(descResults[i]))
            {
              skillResults.push(descResults[i]);
            }
          }
  
          SkillSearchView.filteredSkills(skillResults.slice(0, 5));
        }, 0);
      } else {
        SkillSearchView.filteredSkills([]);
      }
    });
  
    if (document.getElementById("nav_search_skills")){
      ko.applyBindings(SkillSearchView, document.getElementById("nav_search_skills"));
    }
  }
  
  function SearchGetAllSkills() {
    $.getJSON("/data/skills.json", function(data) {
      SkillSearchView.skills(data.filter(function(skill) { return !skill.characters.map(ch => ch.how).includes("Non-Player Character Only") } ));
    });
  }
  
  function toSkillSearch()
  {
    setTimeout(function() {$("#nav_skillsearch").focus();}, 0);
  }
  
  function toSkillsPage()
  {
    let skillText = $("#nav_skillsearch").val();
    setTimeout(function() {
      window.location = "/farming/skills/" + (skillText !== "" ? "?skill=" + skillText : "");
    }, 1000);
  }
  
  function toCardSearch() {
    let valueArticleSearch = $("#nav_searchbar").val();
    if(valueArticleSearch!="") {
      CardSearchView.searchTermNAV(valueArticleSearch);
    }
    setTimeout(function() {$("#nav_cardsearch").focus();}, 160);
  }
  
  function toArticleSearch() {
    let valueCardSearch = $("#nav_cardsearch").val();
    if(valueCardSearch!="") {
      $("#nav_searchbar").val(valueCardSearch);
      sjs.search(valueCardSearch);
    }
    setTimeout(function() {$("#nav_searchbar").focus();}, 0);
  };
