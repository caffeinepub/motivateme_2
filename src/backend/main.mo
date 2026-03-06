import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type Quote = {
    id : Nat;
    text : Text;
    author : Text;
    category : Text;
  };

  let quotes : [Quote] = [
    { id = 0; text = "Believe you can and you're halfway there."; author = "Theodore Roosevelt"; category = "Motivation" },
    { id = 1; text = "Success is not the key to happiness. Happiness is the key to success."; author = "Albert Schweitzer"; category = "Motivation" },
    { id = 2; text = "The only way to do great work is to love what you do."; author = "Steve Jobs"; category = "Career" },
    { id = 3; text = "The best way to predict the future is to create it."; author = "Peter Drucker"; category = "Motivation" },
    { id = 4; text = "Don't watch the clock; do what it does. Keep going."; author = "Sam Levenson"; category = "Motivation" },
    { id = 5; text = "Success is not final, failure is not fatal: It is the courage to continue that counts."; author = "Winston Churchill"; category = "Motivation" },
    { id = 6; text = "The only limit to our realization of tomorrow will be our doubts of today."; author = "Franklin D. Roosevelt"; category = "Motivation" },
    { id = 7; text = "Dreams don't work unless you do."; author = "John C. Maxwell"; category = "Motivation" },
    { id = 8; text = "The secret of getting ahead is getting started."; author = "Mark Twain"; category = "Motivation" },
    { id = 9; text = "You don't have to be great to start, but you have to start to be great."; author = "Zig Ziglar"; category = "Motivation" },
    { id = 10; text = "The road to success and the road to failure are almost exactly the same."; author = "Colin R. Davis"; category = "Motivation" },
    { id = 11; text = "Success is not in what you have, but who you are."; author = "Bo Bennett"; category = "Motivation" },
    { id = 12; text = "The only place where success comes before work is in the dictionary."; author = "Vidal Sassoon"; category = "Motivation" },
    { id = 13; text = "Success usually comes to those who are too busy to be looking for it."; author = "Henry David Thoreau"; category = "Motivation" },
    { id = 14; text = "Success is walking from failure to failure with no loss of enthusiasm."; author = "Winston Churchill"; category = "Motivation" },
    { id = 15; text = "The journey of a thousand miles begins with one step."; author = "Lao Tzu"; category = "Motivation" },
    { id = 16; text = "Your education is a dress rehearsal for a life that is yours to lead."; author = "Nora Ephron"; category = "Student Success" },
    { id = 17; text = "Education is the most powerful weapon which you can use to change the world."; author = "Nelson Mandela"; category = "Student Success" },
    { id = 18; text = "The future belongs to those who believe in the beauty of their dreams."; author = "Eleanor Roosevelt"; category = "Student Success" },
    { id = 19; text = "Learning never exhausts the mind."; author = "Leonardo da Vinci"; category = "Student Success" },
    { id = 20; text = "The roots of education are bitter, but the fruit is sweet."; author = "Aristotle"; category = "Student Success" },
    { id = 21; text = "Education is not preparation for life; education is life itself."; author = "John Dewey"; category = "Student Success" },
    { id = 22; text = "The more that you read, the more things you will know."; author = "Dr. Seuss"; category = "Student Success" },
    { id = 23; text = "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."; author = "Malcolm X"; category = "Student Success" },
    { id = 24; text = "The purpose of education is to replace an empty mind with an open one."; author = "Malcolm Forbes"; category = "Student Success" },
    { id = 25; text = "Education is the kindling of a flame, not the filling of a vessel."; author = "Socrates"; category = "Student Success" },
    { id = 26; text = "Choose a job you love, and you will never have to work a day in your life."; author = "Confucius"; category = "Career" },
    { id = 27; text = "The best way to find yourself is to lose yourself in the service of others."; author = "Mahatma Gandhi"; category = "Career" },
    { id = 28; text = "Opportunities don't happen, you create them."; author = "Chris Grosser"; category = "Career" },
    { id = 29; text = "The only way to do great work is to love what you do."; author = "Steve Jobs"; category = "Career" },
    { id = 30; text = "Don't be afraid to give up the good to go for the great."; author = "John D. Rockefeller"; category = "Career" },
    { id = 31; text = "The future depends on what you do today."; author = "Mahatma Gandhi"; category = "Career" },
    { id = 32; text = "Success is not the key to happiness. Happiness is the key to success."; author = "Albert Schweitzer"; category = "Career" },
    { id = 33; text = "The harder you work for something, the greater you'll feel when you achieve it."; author = "Anonymous"; category = "Career" },
    { id = 34; text = "Don't stop when you're tired. Stop when you're done."; author = "Wesley Snipes"; category = "Career" },
    { id = 35; text = "Success seems to be connected with action. Successful people keep moving."; author = "Conrad Hilton"; category = "Career" },
    { id = 36; text = "The only difference between ordinary and extraordinary is that little extra."; author = "Jimmy Johnson"; category = "Positivity" },
    { id = 37; text = "Happiness is not something ready-made. It comes from your own actions."; author = "Dalai Lama"; category = "Positivity" },
    { id = 38; text = "Positivity always wins. Always."; author = "Gary Vaynerchuk"; category = "Positivity" },
    { id = 39; text = "Keep your face always toward the sunshine—and shadows will fall behind you."; author = "Walt Whitman"; category = "Positivity" },
    { id = 40; text = "The only limit to our realization of tomorrow will be our doubts of today."; author = "Franklin D. Roosevelt"; category = "Positivity" },
    { id = 41; text = "Stay positive, work hard, make it happen."; author = "Anonymous"; category = "Positivity" },
    { id = 42; text = "Positive anything is better than negative nothing."; author = "Elbert Hubbard"; category = "Positivity" },
    { id = 43; text = "The power of imagination makes us infinite."; author = "John Muir"; category = "Positivity" },
    { id = 44; text = "You are never too old to set another goal or to dream a new dream."; author = "C.S. Lewis"; category = "Positivity" },
  ];

  let favoritesMap = Map.empty<Principal, [Nat]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getQuoteOfDay() : async Quote {
    let dayIndex = 0;
    let quoteIndex = dayIndex % quotes.size();
    quotes[quoteIndex];
  };

  public query ({ caller }) func getAllQuotes() : async [Quote] {
    quotes;
  };

  public query ({ caller }) func getQuotesByCategory(category : Text) : async [Quote] {
    quotes.filter(func(q) { q.category == category });
  };

  public query ({ caller }) func getFavorites() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };
    switch (favoritesMap.get(caller)) {
      case (null) { [] };
      case (?favorites) { favorites };
    };
  };

  public shared ({ caller }) func addFavorite(quoteId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };
    if (quoteId >= quotes.size()) {
      Runtime.trap("Quote with provided ID does not exist");
    };

    let currentFavs = switch (favoritesMap.get(caller)) {
      case (null) { [] };
      case (?favs) { favs };
    };

    if (currentFavs.find(func(id) { id == quoteId }) != null) {
      return;
    };

    let newFavs = currentFavs.concat([quoteId]);
    favoritesMap.add(caller, newFavs);
  };

  public shared ({ caller }) func removeFavorite(quoteId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };
    if (quoteId >= quotes.size()) {
      Runtime.trap("Quote with provided ID does not exist");
    };

    switch (favoritesMap.get(caller)) {
      case (null) { Runtime.trap("No favorites found for this user") };
      case (?currentFavs) {
        let newFavs = currentFavs.filter(func(id) { id != quoteId });
        favoritesMap.add(caller, newFavs);
      };
    };
  };
};
